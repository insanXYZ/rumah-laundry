import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export const CardDashboard = ({
  description,
  title,
}: {
  description: string;
  title: string;
}) => {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{description}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {title}
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
