import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import LOCATIONS from '../../shared/consts/locations';
import { Player } from '../../shared/types/game';

const CreateGamePage = (): JSX.Element => {
	const ref = useRef(null);
	const router = useRouter();
	const [players, setPlayers] = useState<Player[]>([]);
	const [currentCount, setCurrentCount] = useState<string>('');
	const [currentValue, setCurrentValue] = useState<string>('');

	const createPlayers = () => {
		localStorage.playersCount = Number(currentCount);

		var _players = new Array(Number(currentCount)).fill({
			name: '',
			isAgent: false,
		});
		
		setPlayers(JSON.parse(JSON.stringify(_players)));
	};

	const createGame = () => {
		const agentID = Math.floor(Math.random() * Number(currentCount));
		var _players = players;
		_players[agentID].isAgent = true;
		
		setPlayers(JSON.parse(JSON.stringify(_players)));
		
		localStorage.setItem('players', JSON.stringify(players));

		var _locations = currentValue.split(', '); 
		var _location = '';
		if (_locations.length>1) {
			const locationID = Math.floor(Math.random() * _locations.length);
			_location = _locations[locationID];
		}
		else {
			const locationID = Math.floor(Math.random() * LOCATIONS.length);
			_location = LOCATIONS[locationID];
		}
		
		localStorage.setItem('location', _location);

		(ref as any).current.style.opacity = 0;

		setTimeout(() => {
			router.push('/game');
		}, 200);
	};

	const setName = (id:number, name:string) => {
		var _players = players;

		_players[id].name = name;
		setPlayers(JSON.parse(JSON.stringify(_players)));
	};

	return(
		<div className='p-8 bg-white min-h-screen' ref={ref}>
			<h1 className='font-bold text-3xl'>
				Создание игры
			</h1>

			<Input 
				className='mt-4 md:w-2/3'
				value={currentCount}
				onChange={(e) => setCurrentCount(e.target.value)}
				placeholder='Количество игроков' />
			
			<h2 className='font-bold text-2xl mt-4'>
				Если хочешь играть в своих локациях - введи их через запятую, иначе пропусти поле
			</h2>
			<Input 
				className='mt-4 md:w-2/3' 
				value={currentValue}
				placeholder='Локации'
				onChange={(e) => setCurrentValue(e.target.value)} />

			{!players[0] && (
				<Button className='w-full md:w-1/2 xl:w-1/3 mt-4' onClick={() => createPlayers()}>
					Продолжить
				</Button>
			)}

			{players[0] && (
				<h2 className='font-bold text-2xl mt-4'>
					Введите свои имена, чтобы мы могли общаться!
				</h2>
			)}

			{players.map((item, i) => (
				<Input 
					key={i} 
					placeholder={`Игрок ${i+1}`} 
					className='mt-4 md:w-2/3'
					value={item.name}
					onChange={(e) => setName(i, e.target.value)} />
			))}

			{players[0] && (
				<Button className='w-full md:w-1/2 xl:w-1/3 my-4' onClick={() => createGame()}>
					Создать игру
				</Button>
			)}
		</div>
	);
};

export default CreateGamePage;
