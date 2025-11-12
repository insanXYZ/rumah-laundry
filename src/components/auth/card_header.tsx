import { CardDescription, CardHeader, CardTitle } from "../ui/card";

interface cardHeaderAuthProps {
  title: string;
  description: string;
}

export default function CardHeaderAuth(props: cardHeaderAuthProps) {
  return (
    <CardHeader className="text-center">
      <CardTitle className="text-xl">{props.title}</CardTitle>
      <CardDescription>{props.description}</CardDescription>
    </CardHeader>
  );
}
