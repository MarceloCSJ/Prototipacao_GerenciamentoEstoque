interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">{message}</div>
  );
}
