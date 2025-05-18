import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PhaserCanvas from './routes/PhaserCanvas';
import RootRedirect from './routes/RootRedirect';
import Login from './routes/Login';
import Register from './routes/Register';
import ForgotPassword from './routes/ForgotPassword';
import ResetPassword from './routes/ResetPassword';
import RequireAuth from './routes/RequireAuth';
import SideBar from './routes/SideBar';
import MainMenu from './routes/MainMenu';
import Store from './routes/Store';
import InfoUser from './routes/InfoUser';
import Help from './routes/Help';
import DeckStore from './routes/Store/routes/DeckStore';
import BackgroundStore from './routes/Store/routes/BackgroundStore';
import AvatarStore from './routes/Store/routes/AvatarStore';
import LobbyList from './routes/LobbyList';
import Lobby from './routes/Lobby';
import Game from './routes/Game';


const App: React.FC = () => (
    <Router>
      <Routes>
        <Route path="/" element={< RootRedirect/>} />
				<Route path="/login" element={<Login/>} />
				<Route path="/register" element={<Register/>} />
				<Route path="/forgot-password" element={<ForgotPassword/>} />
				<Route path='/reset-password/:token' element={<ResetPassword/>} />
				<Route path="/pokariba" element={<RequireAuth/>}>
					<Route element={<SideBar/>}>
						<Route index element={<MainMenu/>} />
						<Route path='store' element={<Store />}>
							<Route path='deck' element={<DeckStore />} />
							<Route path='background' element={<BackgroundStore />} />
							<Route path='avatar' element={<AvatarStore />} />
						</Route>
						<Route path='user' element={<InfoUser />} />
						<Route path='help' element={<Help />} />
					</Route>
					<Route path="game" element={<Game />}>
						<Route path="lobby-list" element={<LobbyList />} />
						<Route path="lobby" element={<Lobby />} />
						<Route path="play" element={<PhaserCanvas />} />
					</Route>
				</Route>
      	<Route path="*" element={<RootRedirect/>} />
      </Routes>
    </Router>
);

export default App;
