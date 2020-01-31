//import AsyncStorage from "@react-native-community/async-storage";
import { AsyncStorage } from "react-native";
import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import rootReducer from "./reducers/index";

const persistedReducer = persistReducer({
    key: "root",
    storage: AsyncStorage,
    whitelist: [
        "authReducer"
    ]
}, rootReducer)

const store = createStore(persistedReducer);
let persistor = persistStore(store);

export { store, persistor }