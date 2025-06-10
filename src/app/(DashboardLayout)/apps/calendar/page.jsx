import React from "react";
import PageContainer from "@/app/components/container/PageContainer";
import BlankCard from "@/app/components/shared/BlankCard";
import { CardContent } from "@mui/material";
import BigCalendar from "@/app/components/apps/calendar";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Calendário",
  },
];

function page() {
  return (
      <PageContainer title="Calendário" description="Calendário">
        <BlankCard>
          <CardContent>
            <BigCalendar />
          </CardContent>
        </BlankCard>
      </PageContainer>
  );
}

export default page;
