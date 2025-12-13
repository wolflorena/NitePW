export type MockUser = {
  id: number;
  username: string;
  password: string; // plain for mock
  isAdmin: boolean;
};

const USERS: MockUser[] = [
  { id: 1, username: "admin", password: "admin123", isAdmin: true },
  { id: 2, username: "ion", password: "1234", isAdmin: false },
  { id: 3, username: "ana", password: "pass", isAdmin: false },
];

export type LoginResult =
  | { ok: true; id: number; username: string; isAdmin: boolean }
  | { ok: false; message: string };

export async function mockLogin(
  username: string,
  password: string
): Promise<LoginResult> {
  await new Promise((r) => setTimeout(r, 350));

  const user = USERS.find((u) => u.username === username);
  if (!user) return { ok: false, message: "This account doesn't exist!" };

  if (user.password !== password)
    return { ok: false, message: "Wrong password!" };

  return {
    ok: true,
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin,
  };
}
