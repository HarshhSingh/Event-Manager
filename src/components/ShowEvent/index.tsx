import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CustomPopover } from "../ui/popover";
import { useCalendarStore } from "@/useCalendarStore";
import { Calendar, Pencil, Trash2, X } from "lucide-react";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { useState } from "react";
import { Confirmation } from "../Confirmation";
import { toast } from "sonner";
import { AddEvent } from "../AddEvent";

interface IProps {
  open: boolean;
  handleClose: () => void;
  anchor: HTMLElement;
  id: string;
}
export const ShowEvent = ({ open, handleClose, anchor, id }: IProps) => {
  const { getEventsById, deleteEvent,editEvent } = useCalendarStore();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const queryClient = useQueryClient();

  const selectedEventQuery = useQuery({
    queryKey: ["EventById"],
    queryFn: () => {
      const data = getEventsById(id);
      return data;
    },
  });
  const deleteEventMutation = useMutation({
    mutationKey: ["deleteEvent"],
    mutationFn: async () => {
      await deleteEvent(id);
    },
    onSuccess: () => {
      toast("Event Deleted");
      queryClient.refetchQueries({
        queryKey: ["getEvents"],
      });
      handleClose();
    },
    onError: () => {
      toast("Something went wrong");
    },
  });

  return (
    <CustomPopover
      anchorEl={anchor}
      isOpen={open}
      align="start"
      onClose={handleClose}
      className="p-2"
    >
      <div className="flex flex-row justify-end ">
        <Button
          variant="link"
          className="px-1 py-1.5"
          onClick={() => setShowEditModal(true)}
        >
          <Pencil />
        </Button>

        <Button
          variant="link"
          onClick={() => setConfirmDelete(id)}
          className="px-1 py-1.5"
        >
          <Trash2 />
        </Button>
        <Button variant="link" onClick={handleClose} className="px-1 py-1.5">
          <X />
        </Button>
      </div>
      <div className="flex flex-col gap-4 p-6 pt-2">
        <div className="space-y-2">
          <h2 className="font-bold">{selectedEventQuery?.data?.title}</h2>
          <div className="flex flex-row p-1  gap-1">
            <Calendar size="20px" />
            <p className="text-sm">
              Event Start:{" "}
              {format(selectedEventQuery?.data?.start ?? new Date(), "PP")}
            </p>
          </div>
          <div className="flex flex-row p-1  gap-1">
            <Calendar size="20px" />
            <p className="text-sm">
              Event End:{" "}
              {selectedEventQuery?.data?.end
                ? format(selectedEventQuery?.data?.end ?? new Date(), "PP")
                : "-"}
            </p>
          </div>
        </div>
      </div>
      {!!confirmDelete ? (
        <Confirmation
          handleClose={() => setConfirmDelete(null)}
          handleYes={() => deleteEventMutation.mutate()}
          open={!!confirmDelete}
        />
      ) : null}
      {showEditModal ? (
        <AddEvent
          open
          createEvent={editEvent}
          handleClose={() => setShowEditModal(false)}
          editMode
          eventData={selectedEventQuery?.data ?? undefined}
        />
      ) : null}
    </CustomPopover>
  );
};
