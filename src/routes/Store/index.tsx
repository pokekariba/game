import React from 'react';
import Button from '../../components/Button';
import logo from '../../assets/img/logo-pokariba.webp';
import { Outlet, useLocation } from 'react-router-dom';
import { StoreService } from '../../services/store.service';
import { useLojaStore } from '../../store/useLojaStore';

const Store: React.FC = () => {
  const location = useLocation();
  const [pagAberta, setPagAberta] = React.useState('');
  const [mostrarModal, setMostrarModal] = React.useState(false);
  const [quantidade, setQuantidade] = React.useState(100);
  const [formaPagamento, setFormaPagamento] = React.useState('credito');
  const cartas = useLojaStore((s) => s.cartas);

  React.useEffect(() => {
    const path = location.pathname.split('/')[3];
    setPagAberta(path);
    if (!cartas.length) {
      StoreService.listaItensLoja();
    }
  }, [location]);

  const comprarMoedas = async () => {
    await StoreService.comprarMoedas(quantidade);
    setMostrarModal(false);
  };

  return (
    cartas.length && (
      <div className="container d-flex flex-row align-center">
        {/* Menu lateral */}
        <div className="d-flex flex-column align-center gap-4 px-3 py-4 my-5">
          <img className="store__logo" src={logo} alt="Logo" />
          <h1 className="fs-5 text-white mx-auto">Loja</h1>

          <Button
            className="store__paddingx"
            border={false}
            color={pagAberta === 'deck' ? 'primary' : 'white'}
            href="deck"
          >
            Decks
          </Button>

          <Button
            className="store__paddingx"
            border={false}
            color={pagAberta === 'background' ? 'primary' : 'white'}
            href="background"
          >
            Fundo
          </Button>

          {/* <Button
            className="store__paddingx"
            border={false}
            color={pagAberta === 'avatar' ? 'primary' : 'white'}
            href="avatar"
          >
            Avatar
          </Button> */}

          <Button
            className="px-5"
            border={false}
            color="gold"
            onClick={() => setMostrarModal(true)}
          >
            Comprar Moedas
          </Button>
        </div>
        <Outlet />
        {mostrarModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="fs-5 mx-auto">Comprar Moedas</h2>

              <div className="coin-options">
                {[100, 200, 300, 400, 500].map((qtd) => (
                  <Button
                    key={qtd}
                    className="store__paddingx px-5"
                    border={false}
                    color={quantidade === qtd ? 'gold' : 'white'}
                    onClick={() => setQuantidade(qtd)}
                  >
                    {qtd}
                  </Button>
                ))}
              </div>

              <h2 className="fs-5 mx-auto">Formas de pagamento</h2>

              <div className="payment-methods">
                {[
                  { value: 'credito', label: 'Cartão de crédito' },
                  { value: 'debito', label: 'Cartão de débito' },
                  { value: 'pix', label: 'PIX' },
                  { value: 'boleto', label: 'Boleto' },
                ].map((forma) => (
                  <Button
                    key={forma.value}
                    className="store__paddingx"
                    color={formaPagamento === forma.value ? 'gold' : 'white'}
                    onClick={() => setFormaPagamento(forma.value)}
                  >
                    {forma.label}
                  </Button>
                ))}
              </div>

              <div className="modal-actions">
                <Button
                  className="store__paddingx primary"
                  onClick={comprarMoedas}
                >
                  Finalizar Compra
                </Button>

                <Button
                  className="store__paddingx"
                  onClick={() => setMostrarModal(false)}
                >
                  Cancelar Compra
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default Store;
