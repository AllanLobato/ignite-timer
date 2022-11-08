import { HandPalm, Play } from "phosphor-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useContext } from "react";

import {
    HomeContainer,
    StartCountdownButton,
    StopCountdownButton,
} from "./styles";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { CyclesContext } from "../../contexts/CyclesContext";

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa"),
    minutesAmount: zod
        .number()
        .min(1, "O ciclo precisa ser de no mínimo 1 minuto")
        .max(60, "O ciclo precisa ser de no máximo 60 minutos"),
});

// controled / uncontrolled - Os formuladrios podem ser uma dessas opções. COntrolled ganha na fluidez mas perde em relação a performande em aplicações grandes.

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>; // Sempre que for referenciar uma variável javascript dentro do Typescript é necessário utilizar o type of, caso contrario dá erro.

export function Home() {
    const { activeCycle, createNewCycle, interruptCurrentCycle } =
        useContext(CyclesContext);

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            // Define um valor inicial
            task: "",
            minutesAmount: 0,
        },
    });

    const { handleSubmit, watch, reset } = newCycleForm;

    function handleCreateNewCycle(data: NewCycleFormData) {
        createNewCycle(data);
    }

    const task = watch("task");
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>
                <Countdown />

                {activeCycle ? (
                    <StopCountdownButton
                        onClick={interruptCurrentCycle}
                        type="button"
                    >
                        <HandPalm size={24} />
                        Parar
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton
                        disabled={isSubmitDisabled}
                        type="submit"
                    >
                        <Play size={24} />
                        Começar
                    </StartCountdownButton>
                )}
            </form>
        </HomeContainer>
    );
}
