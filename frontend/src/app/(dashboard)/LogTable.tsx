import {
  Card,
  Title,
  Text,
  Flex,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  Badge,
  Button,
} from "@tremor/react";

export type ApiLogType = Array<{
  success: boolean;
  userId: string;
  status_code: number;
  error_message: string;
  created_at: string;
  api_request: any;
  api_response: any;
}>;

type Props = {
  className?: string;
  data: Array<{
    success: boolean;
    userId: string;
    status_code: number;
    error_message: string;
    created_at: string;
    api_request: any;
    api_response: any;
  }>;
};

export default function ({ className = "", data }: Props) {
  return (
    <Card>
      <Flex justifyContent="start" className="space-x-2">
        <Title>Call Logs</Title>
        <Badge color="gray">{data.length}</Badge>
      </Flex>
      <Text className="mt-2">
        Detailed description within this period
      </Text>
      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>User ID</TableHeaderCell>
            <TableHeaderCell>Timestamp</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Error Message</TableHeaderCell>
            <TableHeaderCell className="text-right">Request</TableHeaderCell>
            <TableHeaderCell>Response</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.created_at}>
              <TableCell>{item.userId}</TableCell>
              <TableCell>{item.created_at}</TableCell>
              <TableCell>
                <Badge color={item.success ? "gray" : "rose"} size="xs">
                  {item.status_code}
                </Badge>{" "}
                {item.success ? "Success" : "Failed"}
              </TableCell>
              <TableCell>{item.error_message || "-"}</TableCell>
              <TableCell>
                <Button
                  className="text-right float-right"
                  size="xs"
                  variant="secondary"
                  color="gray"
                >
                  See details
                </Button>
              </TableCell>
              <TableCell>
                <Button size="xs" variant="secondary" color="gray">
                  See details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
