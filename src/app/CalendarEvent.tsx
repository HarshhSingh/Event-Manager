"use client";
import FullCalendar from "@fullcalendar/react";
import { useRef, useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { SidebarWithCalendar } from "@/components/components-sidebar-12";
import { useCalendarStore } from "@/useCalendarStore";
import {
  DateSelectArg,
  EventClickArg,
  EventSourceInput,
} from "@fullcalendar/core";
import { AddEvent } from "@/components/AddEvent";
import { useQuery } from "@tanstack/react-query";
import { ShowEvent } from "@/components/ShowEvent";

export default function CalendarEvent() {
  const { createEvent, getEvents } = useCalendarStore();
  const [showAddEventModal, setshowAddEventModal] =
    useState<DateSelectArg | null>(null);

  const [showEventModal, setshowEventModal] = useState<null | EventClickArg>(
    null
  );
  const eventsQuery = useQuery({
    queryKey: ["getEvents"],
    queryFn: () => {
      console.log('get events');
      
      return getEvents();
    },

  });

  const calendarRef = useRef<FullCalendar | null>(null);

  return (
    <SidebarWithCalendar>
      <div className="w-full px-8 py-8">
        {!eventsQuery?.isPending ? (
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek",
            }}
            initialView="dayGridMonth"
            nowIndicator={true}
            defaultAllDay
            editable={true}
            selectable={true}
            selectMirror={true}
            eventClick={(arg) => {
              setshowEventModal(arg);
            }}
            select={(arg) => {
              setshowAddEventModal(arg);
            }}
            events={eventsQuery?.data as EventSourceInput}
          />
        ) : (
          <div>loader</div>
        )}
      </div>
      {!!showAddEventModal ? (
        <AddEvent
          date={showAddEventModal}
          handleClose={() => setshowAddEventModal(null)}
          createEvent={createEvent}
          open={!!showAddEventModal}
        />
      ) : null}
      {!!showEventModal ? (
        <ShowEvent
          handleClose={() => setshowEventModal(null)}
          open={!!showEventModal}
          id={showEventModal?.event?.id}
          anchor={showEventModal?.el}
        />
      ) : null}
    </SidebarWithCalendar>
  );
}
