import { differenceInSeconds } from "date-fns";
import {
    createContext,
    ReactNode,
    useEffect,
    useReducer,
    useState,
} from "react";
import {
    ActionTypes,
    addNewCycleAction,
    interruptCurrentCycleAction,
    markCurrentCycleAsFinishedAction,
} from "../reducers/cycles/actions";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";

interface CreateCycleData {
    task: string;
    minutesAmount: number;
}

interface CyclesContextType {
    cycles: Cycle[];
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    amountSecondsPassed: number;
    markCurrentCycleAsFinished: () => void; // void quer dizer que não tem retorno
    setSecondsPassed: (seconds: number) => void;
    createNewCycle: (data: CreateCycleData) => void;
    interruptCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

interface CycleContextProviderProps {
    children: ReactNode; //Qualquer JSX válido
}

export function CyclesContextProvider({ children }: CycleContextProviderProps) {
    // const [cycles, setCycles] = useReducer<Cycle[]>([]); // Sempre iniciar o estado com o tipo de informação que vou manusear a aplicação toda

    const [cyclesState, dispatch] = useReducer(
        cyclesReducer,
        {
            cycles: [],
            activeCycleId: null,
        },
        () => {
            const storedStateAsJSON = localStorage.getItem(
                "@ignite-timer:cycles-state-1.0.0"
            );
            if (storedStateAsJSON) {
                return JSON.parse(storedStateAsJSON);
            }
        }
    );

    const { cycles, activeCycleId } = cyclesState;

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
        if (activeCycle) {
            return differenceInSeconds(
                new Date(),
                new Date(activeCycle.startDate)
            );
        }
        return 0;
    });

    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState);

        localStorage.setItem("@ignite-timer:cycles-state-1.0.0", stateJSON);
    }, [cyclesState]);

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds);
    }

    function markCurrentCycleAsFinished() {
        dispatch(markCurrentCycleAsFinishedAction());
    }

    function createNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        };

        dispatch(addNewCycleAction(newCycle));

        // setCycles((state) => [...state, newCycle]); // Sempre que uma alteração de estado depender do valor anterior, usar arrow function
        setAmountSecondsPassed(0);
    }

    function interruptCurrentCycle() {
        dispatch(interruptCurrentCycleAction());
        // // Se o ciclo for o ciclo ativo, eu vou retornar todos os dados do ciclo, porém vou add uma nova informação chamada interruptedDate como sendo a data atual. Seão, retorno o ciclo sem alterações
    }

    return (
        <CyclesContext.Provider
            value={{
                cycles,
                activeCycle,
                activeCycleId,
                markCurrentCycleAsFinished,
                amountSecondsPassed,
                setSecondsPassed,
                createNewCycle,
                interruptCurrentCycle,
            }}
        >
            {children}
        </CyclesContext.Provider>
    );
}
