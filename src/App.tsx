/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StoreProvider } from './store';
import AppShell from './components/AppShell';

export default function App() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}
