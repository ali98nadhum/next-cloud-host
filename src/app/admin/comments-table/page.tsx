import { verifyTokenForPage } from '@/utils/verifyTokken';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';


const AdminCommentsPage = () => {
  const token = cookies().get("jwtToken")?.value;
  if (!token) redirect("/");

  const payload = verifyTokenForPage(token);
  if (payload?.isAdmin === false) redirect("/");
  return (
    <div>
      hello 222222
    </div>
  )
}

export default AdminCommentsPage
