import { createContext, ReactNode, useState } from "react";

interface CreateCycleData {
    task: string;
    minutesAmount: number;
}

interface Cycle {
    // os ciclos devem ser identificados por um id
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date; // tanto data quanto horario
    interrupteDate?: Date;
    finishedDate?: Date;
}

interface CyclesContextType {
    cycles: Cycle[];
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    amountSecondsPassed: number;
    markCurrentAsFinished: () => void; // void quer dizer que não tem retorno
    setSecondsPassed: (seconds: number) => void;
    createNewCycle: (data: CreateCycleData) => void;
    interruptCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

interface CycleContextProviderProps {
    children: ReactNode; //Qualquer JSX válido
}

export function CyclesContextProvider({ children }: CycleContextProviderProps) {
    children;
    const [cycles, setCycles] = useState<Cycle[]>([]); // Sempre iniciar o estado com o tipo de informação que vou manusear a aplicação toda
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds);
    }

    function markCurrentAsFinished() {
        setCycles((state) =>
            state.map((cycle) => {
                if (cycle.id === activeCycleId) {
                    return { ...cycle, finishedDate: new Date() };
                } else {
                    return cycle;
                }
            })
        );
    }

    function createNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        };

        setCycles((state) => [...state, newCycle]); // Sempre que uma alteração de estado depender do valor anterior, usar arrow function
        setActiveCycleId(id);
        setAmountSecondsPassed(0);
    }

    function interruptCurrentCycle() {
        // Se o ciclo for o ciclo ativo, eu vou retornar todos os dados do ciclo, porém vou add uma nova informação chamada interruptedDate como sendo a data atual. Seão, retorno o ciclo sem alterações

        setCycles((state) =>
            state.map((cycle) => {
                if (cycle.id === activeCycleId) {
                    return { ...cycle, interrupteDate: new Date() };
                } else {
                    return cycle;
                }
            })
        );
        setActiveCycleId(null);
    }

    return (
        <CyclesContext.Provider
            value={{
                cycles,
                activeCycle,
                activeCycleId,
                markCurrentAsFinished,
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
