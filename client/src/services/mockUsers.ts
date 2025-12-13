export type Gender = "Male" | "Female" | "Other";

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  gender: Gender;
  birthdate: string; // ISO date string (yyyy-mm-dd)
  isAdmin: boolean;
};

let users: User[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@test.com",
    password: "admin123",
    gender: "Other",
    birthdate: "1990-01-01",
    isAdmin: true,
  },
  {
    id: 2,
    username: "jane",
    email: "janedoe@gmail.com",
    password: "jane123",
    gender: "Female",
    birthdate: "2001-10-01",
    isAdmin: false,
  },
];

export type CreateUserInput = Omit<User, "id">;

export async function mockCreateUser(
  input: CreateUserInput
): Promise<{ ok: true } | { ok: false; message: string }> {
  await new Promise((r) => setTimeout(r, 350));

  const usernameTaken = users.some(
    (u) => u.username.toLowerCase() === input.username.toLowerCase()
  );
  if (usernameTaken) return { ok: false, message: "Username already taken." };

  const emailTaken = users.some(
    (u) => u.email.toLowerCase() === input.email.toLowerCase()
  );
  if (emailTaken) return { ok: false, message: "Email already used." };

  const nextId = Math.max(...users.map((u) => u.id)) + 1;
  users = [...users, { id: nextId, ...input }];

  return { ok: true };
}
