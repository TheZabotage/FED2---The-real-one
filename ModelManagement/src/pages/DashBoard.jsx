import useAuth from '../hooks/useAuth';

const Dashboard = () => {
    const { currentUser } = useAuth();

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <p>Welcome, {currentUser.email}</p>
            <p>You are logged in as {currentUser.isManager ? 'Manager' : 'Model'}.</p>
            {!currentUser.isManager && (
                <p>Model ID: {currentUser.modelId}</p>
            )}
        </div>
    );
};

export default Dashboard;