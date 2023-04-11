import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ICheckIn } from "@/models/checkins";
import { Typography, Card, CardContent } from "@mui/material";

export default function EventCheckins({ id, name }: { id: string, name: string }) {

  let { data: session } = useSession();
  const [checkins, setCheckins] = useState<number>(0);

  useEffect(() => {
    fetch(`${process.env.VITE_BACKEND}/checkin`, { headers: { "Authorization": `Bearer ${session?.id_token ?? "no-token-yet"}` } })
      .then(res => res.json())
      .then(data => {
        if (data) {
          let all_check_ins: Array<ICheckIn> = data as Array<ICheckIn>;
          const number_of_checkins = Array.isArray(all_check_ins) ? all_check_ins.filter((checkin) => checkin.eventId === id) : [];
          setCheckins(number_of_checkins.length);
        }
      });
  }, [id, session?.id_token]);

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h3">
          {checkins ?? 0}
        </Typography>
        <Typography sx={{ mt: 2 }}>
                    Checkins for {name}
        </Typography>
      </CardContent>
    </Card>
  );
}