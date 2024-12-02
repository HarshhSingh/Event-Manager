import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DatePicker } from "./DatePicker";
import { toast } from "sonner";
import { IEvent } from "@/useCalendarStore";
import { DateSelectArg } from "@fullcalendar/core/index.js";
import { useEffect } from "react";
interface IProps {
  date?: DateSelectArg;
  createEvent?: (event: IEvent) => Promise<IEvent[]>;
  open: boolean;
  editMode?: boolean;
  handleClose: () => void;
  eventData?: IEvent;
}
interface IForm {
  id: string;
  start: Date | null;
  end: Date | null;
  title: string;
}
export function AddEvent({
  date,
  createEvent,
  open,
  handleClose,
  eventData,
  editMode = false,
}: IProps) {
  const form = useForm<IForm>({
    defaultValues: {
      id: String(Math.random()),
      title: "",
      start: date?.start ?? new Date(),
      end: null,
    },
  });
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue } = form;

  const createEventMutation = useMutation({
    mutationKey: ["createEvent"],
    mutationFn: async (payload: IEvent) => {

      const res = await createEvent?.(payload);
      return res;
    },
    onSuccess: () => {
      toast("Event Saved");
      queryClient.refetchQueries({
        queryKey: ["getEvents"],
      });
      handleClose();
    },
    onError: () => {
      toast("Something went wrong");
    },
  });
  const handleCreateEvent: SubmitHandler<IForm> = (values) => {
    const payload = {
      ...values,
    };
    createEventMutation.mutate(payload);
  };

  useEffect(() => {
    if (!editMode) return;

    setValue("start", eventData?.start ?? null);
    setValue("end", eventData?.end ?? null);
    setValue("title", eventData?.title ?? "");
    setValue("id", eventData?.id ?? "");
  }, [
    editMode,
    eventData?.end,
    eventData?.id,
    eventData?.start,
    eventData?.title,
    setValue,
  ]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <FormProvider {...form}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit" : "Create"} Event</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-6 py-4">
            <div className="flex flex-row gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <Label htmlFor="name" className="text-left">
                  Event start
                </Label>
                <DatePicker fieldName="start" />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <Label htmlFor="name" className="text-left">
                  Event end
                </Label>
                <DatePicker fieldName="end" />
              </div>
            </div>
            <div className="flex flex-col items-start gap-4">
              <Label htmlFor="name" className="text-left">
                Add Event
              </Label>
              <Input id="name" {...register("title")} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit(handleCreateEvent)}>
              Save Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
