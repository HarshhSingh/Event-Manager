import * as React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { EventSourceInput, EventClickArg } from '@fullcalendar/core'
import { CustomPopover } from './components/CustomPopover'

export default function CalendarComponent() {
  const calendarRef = React.useRef<FullCalendar>(null)
  const [selectedEvent, setSelectedEvent] = React.useState<EventClickArg | null>(null)
  const [popoverOpen, setPopoverOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  const eventsQuery = { data: [] } // Replace with your actual query

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEvent(clickInfo)
    setAnchorEl(clickInfo.el)
    setPopoverOpen(true)
  }

  const handleClosePopover = () => {
    setPopoverOpen(false)
    setSelectedEvent(null)
    setAnchorEl(null)
  }

  return (
    <div className="relative">
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
        eventClick={handleEventClick}
        initialEvents={eventsQuery?.data as EventSourceInput}
      />

      <CustomPopover
        isOpen={popoverOpen}
        onClose={handleClosePopover}
        anchorEl={anchorEl}
      >
        {selectedEvent && (
          <div className="space-y-2">
            <h3 className="font-semibold">{selectedEvent.event.title}</h3>
            <p className="text-sm">
              Start: {selectedEvent.event.start?.toLocaleString()}
            </p>
            <p className="text-sm">
              End: {selectedEvent.event.end?.toLocaleString()}
            </p>
            {/* Add more event details here */}
          </div>
        )}
      </CustomPopover>
    </div>
  )
}

