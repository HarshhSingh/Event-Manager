import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

interface IProps {
  open: boolean;
  handleClose: () => void;
  anchor: HTMLElement;
}
export const ShowEvent = ({ open, handleClose, anchor }: IProps) => {

  const handleClosePopover = () => {
    // anchorRef.current?.removeChild(anchor);
    handleClose();
  };
  // useEffect(() => {
  //   if (anchor && anchorRef.current) {
  //     const rect = anchor.getBoundingClientRect();
  //     console.log(rect);

  //     const refElement = anchorRef.current;
  //     refElement.style.position = "absolute";
  //     refElement.style.top = `${rect.top + window.scrollY}px`;
  //     refElement.style.left = `${rect.left + window.scrollX}px`;
  //     refElement.style.height = "1px"; // Invisible element
  //     refElement.style.width = "1px";
  //   }
  // }, [anchor]);

  console.log(anchor.getBoundingClientRect(), "calc(100vh-120px)");

  const top = `${anchor?.getBoundingClientRect().x}px`;
  console.log(top);

  return (
    <Popover onOpenChange={handleClosePopover} open={open} defaultOpen>
      <PopoverTrigger />
      {/* <PopoverAnchor>
        <div ref={anchorRef} />
      </PopoverAnchor> */}
      <PopoverContent
        className="w-80"
        align="center"
        side="bottom"
        // sideOffset={5}
        style={{
          position: "absolute",
          bottom: anchor
            ? `calc(67vh - ${anchor.getBoundingClientRect().top}px)`
            : "0px",
          right: anchor
            ? `calc(50vw - ${anchor.getBoundingClientRect().left}px)`
            : "0px",
        }}
      >
        <div className="grid gap-4">

         
        </div>
      </PopoverContent>
    </Popover>
  );
};
