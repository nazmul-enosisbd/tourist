import TouristApp from './components/TouristApp'
import {Provider} from 'react-redux'
import store from './redux/store'

store.subscribe(() => {
  console.log("store updated", store.getState());
})

function App() {
  return (
    <Provider store={store}>
    <TouristApp />
    </Provider>
  );
}

export default App;
