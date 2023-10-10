import { useUser } from "@/store/user/context";

const Dashboard = () => {
  const user = useUser();
  return <div>{JSON.stringify(user)}</div>;
};

export default Dashboard;
