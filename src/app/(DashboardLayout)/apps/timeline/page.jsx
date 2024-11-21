'use client';
import React from 'react';
import { CardContent } from '@mui/material';
import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from '@/app/components/container/PageContainer';
import { TimelineProvider } from '@/app/context/timelineContext';
import TimelineList from '@/app/components/apps/timeline/timelineList';

const Timeline = () => {

    return (
        <TimelineProvider>
            <PageContainer title="Timeline" description="Agendamento por agente">
                <BlankCard>
                    <CardContent>
                        <TimelineList />
                    </CardContent>
                </BlankCard>
            </PageContainer>
        </TimelineProvider>
    );
};

export default Timeline;
