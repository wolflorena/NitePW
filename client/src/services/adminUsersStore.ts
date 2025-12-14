export type AdminUserGender = "Male" | "Female" | "Other";

export type AdminUser = {
  id: number;
  username: string;
  email: string;
  gender: AdminUserGender;
  birthdate: string;
  isAdmin: boolean;
  password?: string;
};

const LS_KEY = "nite:admin:users";

const seed: AdminUser[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    gender: "Other",
    birthdate: "2000-01-01",
    isAdmin: true,
    password: "hash",
  },
  {
    id: 2,
    username: "wolflorena",
    email: "wolflorena@example.com",
    gender: "Female",
    birthdate: "2001-05-10",
    isAdmin: false,
    password: "hash",
  },
];

function read(): AdminUser[] {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) {
    localStorage.setItem(LS_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    const parsed = JSON.parse(raw) as AdminUser[];
    return Array.isArray(parsed) ? parsed : seed;
  } catch {
    localStorage.setItem(LS_KEY, JSON.stringify(seed));
    return seed;
  }
}

function write(users: AdminUser[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(users));
}

function nextId(users: { id: number }[]) {
  return users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
}

function normalizeGender(g: unknown): AdminUserGender {
  if (g === "Male" || g === "Female" || g === "Other") return g;
  return "Other";
}

export async function listUsers(): Promise<AdminUser[]> {
  return read();
}

export async function getUserById(
  userId: number
): Promise<AdminUser | undefined> {
  return read().find((u) => u.id === userId);
}

export async function deleteUserById(userId: number): Promise<void> {
  const users = read().filter((u) => u.id !== userId);
  write(users);
}

export async function updateUser(
  userId: number,
  patch: Partial<Omit<AdminUser, "id">>
): Promise<AdminUser> {
  const users = read();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) throw new Error("User not found");

  const current = users[idx];

  const updated: AdminUser = {
    ...current,
    ...patch,
    gender: patch.gender ? normalizeGender(patch.gender) : current.gender,
    isAdmin:
      typeof patch.isAdmin === "boolean" ? patch.isAdmin : current.isAdmin,
  };

  users[idx] = updated;
  write(users);

  return updated;
}

export async function createUser(
  user: Omit<AdminUser, "id">
): Promise<AdminUser> {
  const users = read();
  const newUser: AdminUser = {
    id: nextId(users),
    ...user,
    gender: normalizeGender(user.gender),
  };
  users.push(newUser);
  write(users);
  return newUser;
}

export async function upsertUser(user: AdminUser): Promise<void> {
  const users = read();
  const idx = users.findIndex((u) => u.id === user.id);
  const fixed: AdminUser = { ...user, gender: normalizeGender(user.gender) };

  if (idx >= 0) users[idx] = fixed;
  else users.push(fixed);

  write(users);
}
