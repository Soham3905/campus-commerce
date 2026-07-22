import SDUIRenderer from './SDUIRenderer';
import { Provider } from "react-redux";
import { store } from "./store/store";
function App() {
    return (
        <Provider store={store}>
            <SDUIRenderer />
        </Provider>
    )
}

export default App;
