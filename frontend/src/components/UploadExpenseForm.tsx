import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api, expensesQueryKey } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UploadPayload = {
  file: File;
};

type UploadExpenseFormProps = {
  expenseId: number;
};

export function UploadExpenseForm({ expenseId }: UploadExpenseFormProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async ({ file }: UploadPayload) => {
      setError(null);

      const { uploadUrl, key } = await api.signUpload({
        filename: file.name,
        type: file.type || "application/octet-stream",
      });

      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });

      await api.updateExpense(expenseId, { fileKey: key });
    },
    onSuccess: async () => {
      setFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: expensesQueryKey }),
        queryClient.invalidateQueries({ queryKey: [...expensesQueryKey, expenseId] }),
      ]);
    },
    onError: (cause) => {
      if (cause instanceof Error) {
        setError(cause.message);
      } else if (typeof cause === "object" && cause && "message" in cause) {
        setError(String((cause as { message?: unknown }).message));
      } else {
        setError("Upload failed. Please try again.");
      }
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError("Select a file before uploading.");
      return;
    }
    uploadMutation.mutate({ file });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <label htmlFor="receipt" className="text-sm font-medium text-foreground">
          Receipt
        </label>
        <Input
          id="receipt"
          type="file"
          ref={inputRef}
          onChange={(event) => {
            const selected = event.target.files?.[0] ?? null;
            setFile(selected);
            setError(null);
          }}
          accept="image/*,application/pdf"
        />
        <p className="text-xs text-muted-foreground">
          Upload a receipt (images or PDFs). Files are stored privately and delivered via signed URL.
        </p>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" disabled={uploadMutation.isPending}>
        {uploadMutation.isPending ? "Uploading…" : "Upload Receipt"}
      </Button>
    </form>
  );
}
