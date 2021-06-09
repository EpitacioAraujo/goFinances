import React from 'react';

import { 
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighLightCards
} from './styles';
import { HighLightCard } from '../../components/HighLightCard';

export function Dashboard(){
    return(
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{ uri: 'https://github.com/EpitacioAraujo.png' }} />
                        <User>
                            <UserGreeting>Olá, </UserGreeting>
                            <UserName>Epitacio</UserName>
                        </User>
                    </UserInfo>
                    <Icon name="power" />
                </UserWrapper>
            </Header>

            <HighLightCards>
                <HighLightCard 
                    type="up"
                    title="Entradas"
                    amount="R$ 17.400,00"
                    lastTansaction="Última entrada dia 13 de abril"
                />
                <HighLightCard 
                    type="down"
                    title="Saidas"
                    amount="R$ 1.259,00"
                    lastTansaction="Última entrada dia 03 de abril"
                />
                <HighLightCard 
                    type="total"
                    title="Total"
                    amount="R$ 16.141,00"
                    lastTansaction="01 à 06 de abril"
                />
            </HighLightCards>
        </Container>
    )
}