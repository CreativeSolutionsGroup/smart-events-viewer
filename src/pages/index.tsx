import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { signIn, useSession } from "next-auth/react"
import { ICheckIn } from "@/models/checkins";

let header = new Headers({ "Authorization": `Bearer placeholder-will-be-set` })
let fetcher = (url: string) => fetch(url, { headers: header }).then((res) => res.json());

export default function Home() {

  const { data: session, status } = useSession()

  useEffect(() => {
    header = new Headers({ "Authorization": `Bearer ${session?.id_token}` })
    fetcher = (url: string) => fetch(url, { headers: header }).then((res) => res.json());
  }, [session]);

  const key = process.env["VITE_BACKEND"] + '/checkin'
  const { data: checkinData, error: SWRError } = useSWR(
    key,
    fetcher,
    { refreshInterval: 5000}
  );

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
        <div>
          <div>
            <div>checkins in {limit} hours: {checkins ?? 0}</div>
          </div>
        </div>
      );
  }


  return <a href="/api/auth/signin">Sign in</a>

}