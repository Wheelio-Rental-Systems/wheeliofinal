import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./ui/alert-dialog";
import { AlertTriangle, Trash2 } from 'lucide-react';

const DeleteConfirmationDialog = ({ open, onOpenChange, onConfirm, itemName }) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-[#1e1e2d] border-white/10 text-white max-w-md">
                <AlertDialogHeader>
                    <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
                        <AlertTriangle size={24} />
                    </div>
                    <AlertDialogTitle className="text-xl font-bold text-center">
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400 text-center">
                        This action cannot be undone. This will permanently delete the
                        <span className="text-white font-bold mx-1">{itemName}</span>
                        from your fleet and remove all associated data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6 flex-col sm:flex-row gap-2">
                    <AlertDialogCancel className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white mt-0">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold flex items-center gap-2"
                    >
                        <Trash2 size={16} /> Delete Vehicle
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteConfirmationDialog;
