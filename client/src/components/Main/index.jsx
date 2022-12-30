const Main = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div>
      <h1>Inloggad</h1>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Main;
