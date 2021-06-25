import React, { useState } from 'react'
import { Input } from '../../components/Forms/Input';
import { Button } from '../../components/Forms/Button/Index';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton/index';

import { CategorySelect } from './../../components/Forms/CategorySelect/index';

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes
} from './styles'

export function Register() {
    const [transactionType, setTransactionType] = useState('');

    function handleTransactionTypeSelected(type: 'up' | 'down') {
        setTransactionType(type);
    }

    return (
        <Container>
            <Header>
                <Title>
                    Cadastro
                </Title>
            </Header>

            <Form>
                <Fields>
                    <Input placeholder="Nome" />
                    <Input placeholder="Preço" />

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

                    <CategorySelect title="Categoria" />
                </Fields>

                <Button title="Enviar" />
            </Form>
        </Container>
    );
}