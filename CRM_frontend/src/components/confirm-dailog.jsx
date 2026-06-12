import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
export function ConfirmDialog(props) {
  return (
    <AlertDialog {...props}>
      <AlertDialogContent className={cn(props.className && props.className)}>
        <AlertDialogHeader className="text-start">
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>{props.desc}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {props.children}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={props.isLoading}>
            {props.cancelBtnText ?? "Cancel"}
          </AlertDialogCancel>
          <Button
            type={props.form ? "submit" : "button"}
            form={props.form}
            onClick={props.handleConfirm}
            variant={props.destructive ? "destructive" : "default"}
            disabled={props.disabled || props.isLoading}
          >
            {props.confirmText ?? "Continue"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
