# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## OrderStatus implementation

| Order Status   | Customer can cancel?     | Reason                                                                             |
| -------------- | ------------------------ | ---------------------------------------------------------------------------------- |
| **PENDING**    | ✅ Yes                    | The shop hasn't reviewed the order yet.                                            |
| **ACCEPTED**   | ✅ Usually yes (optional) | If the shop hasn't started preparing it. Some businesses allow this, others don't. |
| **PROCESSING** | ❌ No                     | The shop is already preparing the order and may have incurred costs.               |
| **COMPLETED**  | ❌ No                     | The order is finished. Returns/refunds are a separate process.                     |
| **REJECTED**   | ❌ No                     | The shop already declined the order.                                               |
| **CANCELLED**  | ❌ No                     | Already cancelled.                                                                 |
