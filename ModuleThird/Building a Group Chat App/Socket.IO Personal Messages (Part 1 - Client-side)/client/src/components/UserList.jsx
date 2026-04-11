import './UserList.css';

function UserList({ users, onSelectUser, selectedUser }) {
  return (
    <div className="user-list">
      <h2>Available Users</h2>
      {users.length === 0 && <div className="empty-state">No users available yet.</div>}
      <ul>
        {users.map((user) => (
          <li
            key={user._id}
            className={selectedUser?.username === user.username ? 'active' : ''}
            onClick={() => onSelectUser(user)}
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
