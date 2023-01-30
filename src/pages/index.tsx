import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react"
import { ICheckIn } from "@/models/checkins";
import Link from "next/link";


const fetcher = (params: [string, string]) =>
  fetch(params[0], { headers: { 'Authorization': 'Bearer ' + params[1]} } )
  .then((res) => res.json());

export default function Home() {

  const { data: session, status } = useSession()

  const key = process.env["VITE_BACKEND"] + '/checkin'
  const { data: checkinData, error: SWRError } = useSWR(
    [key, session?.id_token ?? "no-token-yet"],
    fetcher,
    { refreshInterval: 5000 }
  )
  if(checkinData) console.log(checkinData)
  if(SWRError) console.log(SWRError)

  useEffect(() => { 
    checkins_under_limit()
  }, [checkinData])

  const [checkins, setCheckins] = useState<number>();
  const limit = 2000;
  const lim = limit * 60 * 60 * 1000;

  const checkins_under_limit = () => {
    if(checkinData){
      let all_check_ins: Array<ICheckIn> = checkinData as Array<ICheckIn>;
      const number_of_checkins = Array.isArray(all_check_ins) ? all_check_ins.filter((checkin) => (Date.now() - new Date(checkin.created).getTime()) < lim): [];
      setCheckins(number_of_checkins.length);
    }
  }

  if (status === "authenticated") {
      return (
        <div>checkins in {limit} hours: {checkins ?? 0}</div>
      );
  }


  return <Link href="/api/auth/signin">Sign in</Link>

}