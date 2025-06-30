import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from "./api/auth/authOptions";
import Image from "next/image";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  return redirect('/tasks');
}
