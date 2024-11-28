import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { Button } from "../ui/button";

interface IProps {
  fieldName: string;
}
export const DatePicker = ({ fieldName }: IProps) => {
  const { watch, setValue } = useFormContext();
  console.log(watch(fieldName, "fieldname"));

  return (
    <div className="flex-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full  pl-3 text-left font-normal",
              !fieldName && "text-muted-foreground"
            )}
          >
            {watch(fieldName) ? (
              format(watch(fieldName), "PPP")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-white border-r-2"
          align="start"
        >
          <Calendar
            mode="single"
            // {...register(fieldName)}
            selected={watch(fieldName)}
            onSelect={(date) =>{
                console.log(date);
                
             setValue(fieldName, date)}
            }    
            disabled={(date) => fieldName === "end" && date < watch("start")}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
