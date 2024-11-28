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
import { DateClickArg } from "@fullcalendar/interaction";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { DatePicker } from "./DatePicker";
import { toast } from "sonner";
import { IEvent } from "@/useCalendarStore";
interface IProps {
  date: DateClickArg;
  createEvent: (event: IEvent) => Promise<IEvent[]>;
  open: boolean;
  handleClose: () => void;
}
interface IForm {
  start: Date | null;
  end: Date | null;
  title: string;
}
export function AddEvent({ date, createEvent, open, handleClose }: IProps) {
  const form = useForm<IForm>({
    defaultValues: {
      title: "",
      start: date?.date ?? new Date(),
      end: null,
    },
  });
  const { register, handleSubmit } = form;
  const createEventMutation = useMutation({
    mutationKey: ["createEvent"],
    mutationFn: async (payload: IEvent) => {
      console.log("skljsd");

      const res = await createEvent(payload);
      return res;
      console.log(res, "response");
    },
    onSuccess: () => {
      toast("Event Created");
      handleClose();
    },
    onError: () => {
      toast("Something went wrong");
    },
  });
  const handleCreateEvent: SubmitHandler<IForm> = (values) => {
    const payload = {
      ...values,
      id: String(Math.random()),
    };
    createEventMutation.mutate(payload);
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <FormProvider {...form}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
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
