import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react"
import { ICheckIn } from "@/models/checkins";
import Link from "next/link";
import { Button, Typography, Card, CardContent, Grid } from '@mui/material';


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
      const number_of_checkins = Array.isArray(all_check_ins) ? all_check_ins.filter((checkin) => (Date.now() - new Date(checkin.createdAt).getTime()) < lim): [];
      setCheckins(number_of_checkins.length);
    }
  }

  if (status === "authenticated") {
      return (
        <Grid
          item
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={3}>
      
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography component="h1" variant="h5" sx={{mb: 2}}>
                  checkins in {limit} hours: {checkins ?? 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
      );
  }


  return (
    <Link href="/api/auth/signin" passHref>
      <Button>
        Sign in Here
      </Button>
    </Link>
  )

}