import React from 'react'
import { FlatList } from 'react-native';
import {
    Container,
    Header,
    Title,
    Category,
    Icon,
    Name,
    Separator,
    Footer
} from './styles'

import { Button } from './../../components/Forms/Button/Index';
import { categories } from '../../utils/categories';

interface ICategory {
    key: string;
    name: string;
}

interface Props {
    category: string;
    setCategory: (category: ICategory) => void;
    closeCategory: () => void;
}

export function CategorySelect({
    category,
    setCategory,
    closeCategory
}: Props) {
    return (
        <Container>
            <Header>
                <Title>Categoria</Title>
            </Header>

            <FlatList
                data={categories}
                style={{ flex: 1, width: '100%' }}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => (

                    <Category>
                        <Icon name={item.icon}></Icon>
                        <Name>{item.name}</Name>
                    </Category>
                )}
                ItemSeparatorComponent={() => <Separator />}
            />

            <Footer>
                <Button title="Selecionar" />
            </Footer>
        </Container>
    )
}