import React, { useState, useEffect } from 'react';
import {
    Keyboard,
    Modal,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { InputForm } from '../../components/Forms/InputForm';
import { Button } from '../../components/Forms/Button';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton/index';

import { CategorySelectButton } from '../../components/Forms/CategorySelectButton/index';
import { CategorySelect } from './../CategorySelect/index';

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes
} from './styles'
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FormData {
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name: Yup
        .string()
        .required('Nome é obrigatório'),
    amount: Yup
        .number()
        .typeError('Informe um valor numérico')
        .positive('O valor tem que ser positivo')
        .required('O valor é obrigatório')
})

export function Register() {
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    const dataKey = "@gofinances:transactions";

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    function handleTransactionTypeSelected(type: 'up' | 'down') {
        setTransactionType(type);
    }

    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true);
    }

    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false);
    }

    async function handleRegister(form: FormData) {
        if (!transactionType)
            return Alert.alert("Selecione o tipo de transação");

        if (category.key == 'category')
            return Alert.alert("Selecione a categoria");

        const data = {
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.name
        }

        try{
            await AsyncStorage.setItem(dataKey, JSON.stringify(data));

        }catch(error){
            console.log(error);
            Alert.alert("Não foi possivel salvar");

        }

    }

    useEffect(() => {
        async function loadData(){
            const response = await AsyncStorage.getItem(dataKey);

            console.log(JSON.parse(response!))
        }

        loadData();
    }, [])

    return (
        <TouchableWithoutFeedback
            onPress={() => Keyboard.dismiss}
        >
            <Container>
                <Header>
                    <Title>
                        Cadastro
                    </Title>
                </Header>

                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />

                        <InputForm
                            name="amount"
                            control={control}
                            placeholder="Preço"
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message}
                        />

                        <TransactionsTypes>
                            <TransactionTypeButton
                                type="up"
                                title="Income"
                                onPress={() => { handleTransactionTypeSelected('up') }}
                                isActive={transactionType === 'up'}
                            />
                            <TransactionTypeButton
                                type="down"
                                title="Outcome"
                                onPress={() => { handleTransactionTypeSelected('down') }}
                                isActive={transactionType === 'down'}
                            />
                        </TransactionsTypes>

                        <CategorySelectButton
                            title={category.name}
                            onPress={handleOpenSelectCategoryModal}
                        />
                    </Fields>

                    <Button
                        title="Enviar"
                        onPress={handleSubmit(handleRegister)}
                    />
                </Form>

                <Modal visible={categoryModalOpen} >
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>
    );
}