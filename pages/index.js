import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const {data: session} = useSession()

 return <Layout>
  <div className="rext-blue-900 flex justify-between" >
    <h2>Вітаю, <b>{session?.user?.name}</b>, бажаю продуктивної праці.</h2>
    <div className="flex bg-gray-300 text-black gap-1 rounded-lg overflow-hidden">
       <img src={session?.user?.image} alt='Фото користувача' className="w-8 h-8"/>
       <span className="py-1 px-2">
        {session?.user?.name}
       </span>
    </div>
    
  </div>
 </Layout>
}