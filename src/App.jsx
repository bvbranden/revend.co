import { NotificationProvider } from './contexts/NotificationContext';

// Update the App component to include NotificationProvider
function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <NotificationProvider>
          <Router>
            {/* Rest of your app code */}
          </Router>
        </NotificationProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;