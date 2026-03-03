import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import { appRoutes } from "./routes";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    {appRoutes.map((r) => (
                        <Route key={r.path} path={r.path} element={r.element} />
                    ))}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}