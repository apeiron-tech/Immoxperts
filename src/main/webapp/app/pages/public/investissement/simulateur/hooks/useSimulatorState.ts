import { useCallback, useState } from 'react';
import { DEFAULT_SIMULATOR_INPUT, SimulatorInput } from '../lib/calcInvest';

export function useSimulatorState(initial?: Partial<SimulatorInput>) {
  const [state, setState] = useState<SimulatorInput>({ ...DEFAULT_SIMULATOR_INPUT, ...(initial ?? {}) });

  const update = useCallback(<K extends keyof SimulatorInput>(key: K, value: SimulatorInput[K]) => {
    setState(s => ({ ...s, [key]: value }));
  }, []);

  const reset = useCallback(() => setState({ ...DEFAULT_SIMULATOR_INPUT }), []);

  const replaceAll = useCallback((next: SimulatorInput) => setState(next), []);

  return { state, update, reset, replaceAll };
}
