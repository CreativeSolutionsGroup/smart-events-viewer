import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { ICheckIn } from "@/models/checkins";
import { Typography, Card, CardContent, Grid } from "@mui/material";

/**
 * @param params [url, bearerToken]
 * @returns a fetcher function for use with SWR.
 */
const fetcher = (params: [string, string]) =>
  fetch(params[0], { headers: { "Authorization": "Bearer " + params[1] } })
    .then((res) => res.json());

export default function RecentCheckins() {
  let { data: session } = useSession();
  const { data: checkinData, error: SWRError } = useSWR(
    [`${process.env.VITE_BACKEND}/checkin`, session?.id_token ?? "no-token-yet"],
    fetcher,
    { refreshInterval: 5000 }
  );

  const limit = 24;

  useEffect(() => {
    const limitInMs = limit * 60 * 60 * 1000;

    if (checkinData) {
      let all_check_ins: Array<ICheckIn> = checkinData as Array<ICheckIn>;
      const number_of_checkins = Array.isArray(all_check_ins) ? all_check_ins.filter((checkin) => (Date.now() - new Date(checkin.createdAt).getTime()) < limitInMs) : [];
      setCheckins(number_of_checkins.length);
    }
  }, [checkinData]);

  const [checkins, setCheckins] = useState<number>();


  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h3">
          {checkins ?? 0}
        </Typography>
        <Typography sx={{ mt: 2 }}>
                    Checkins in {limit} hours
        </Typography>
      </CardContent>
    </Card>
  );
}