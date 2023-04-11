import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { IEvent } from "@/models/event";
import Link from "next/link";
import { Button, Typography, Card, CardContent, Grid, FormControl, InputLabel, Select, Box, OutlinedInput, MenuItem, SelectChangeEvent } from "@mui/material";
import RecentCheckins from "@/components/RecentCheckins";
import EventCheckins from "@/components/EventCheckins";


export default function Home() {
  let { data: session, status } = useSession();

  const [optionId, setOptionId] = useState("Recent View");
  const [optionName, setOptionName] = useState("");
  const [events, setEvents] = useState<IEvent[]>();

  const handleChange = (event: SelectChangeEvent) => {
    const selectedId = event.target.value;
    const selectedName = events?.find((e) => e.id === selectedId)?.alias;
    setOptionId(selectedId);
    setOptionName(selectedName ?? "");
  };


  useEffect(() => {
    if (status === "authenticated") {
      fetch(`${process.env.VITE_BACKEND}/me`, { headers: { "Authorization": `Bearer ${session?.id_token ?? "no-token-yet"}` } })
        .then((res) => {
          if (res.status === 403) {
            signIn();
          }
          else {
            fetch(`${process.env.VITE_BACKEND}/events`, { headers: { "Authorization": `Bearer ${session?.id_token ?? "no-token-yet"}` } })
              .then(res => res.json())
              .then(data => setEvents(data));
          }
        });
    }
  }, [status, session]);


  if (status === "authenticated") {
    return (
      <>
        <Grid
          height="100vh"
          item
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="select">Option</InputLabel>
              <Select
                labelId="select"
                id="select"
                value={optionId}
                label="Option"
                onChange={handleChange} 
              >

                <MenuItem value="Recent View">Recent View</MenuItem>
                {events?.map((e, i) => (
                  <MenuItem value={e.id} key={i}>{e.alias}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            {optionId === "Recent View" ? <RecentCheckins /> : <EventCheckins id={optionId} name={optionName} />}
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <Link href="/api/auth/signin" passHref>
      <Button>
        Sign in Here
      </Button>
    </Link>
  );

}