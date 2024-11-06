import { TestBed } from '@angular/core/testing';
import { AuthenticateService } from './authenticate.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpService } from '../http.service';
import { IStorage } from '../../abstract/IStorage';
import { IChangePassword, ILogin, ILogout, IRestoretPassword, IUser } from '../../interfaces/IUser';
import { IResponseApi } from '../../interfaces/IResponseApi';
import { environment } from 'src/environments/environment';
import { TypeResponse } from '../../enums/TypeResponse';

describe('AuthenticateService', () => {
  let service: AuthenticateService;
  let httpMock: HttpTestingController;
  let baseUrl = `${environment.urlServer}`;
  let urlLogin = `${baseUrl}/seguridad/iniciarSesion`;
  let urlLogout = `${baseUrl}/seguridad/cerrarSesion`;
  let urlChangePassword = `${baseUrl}/seguridad/cambiarClave`;
  let urlForgotPassword = `${baseUrl}/seguridad/olvidoClave`;
  let urlRestorePassword = `${baseUrl}/seguridad/restablecerClave`;

  const storageMock = {
    get: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: 'IHttp', useClass: HttpService, },
        { provide: 'IAuthenticate', useClass: AuthenticateService, },
        { provide: IStorage, useValue: storageMock, },
      ]
    });
    service = TestBed.inject(AuthenticateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Prueba inicio de sesión', () => {
    const mocklogin: ILogin = {
      usuario: '123456789',
      clave: '_Clave123',
      georreferencia: {
        x: 10.7637263,
        y: -75.72336763
      }
    };

    const mockUser: IUser = {
      id_usuario: 1,
      nombres: 'nombre',
      apellidos: 'apellidos',
      identificacion: '123456789',
      tipo_identificacion: '123456789',
      ind_cambio_clave: 'N',
      ind_cambio_placa: 'N',
      zonas: [],
      menu: [],
    }

    const mockResponse: IResponseApi = {
      estado: TypeResponse.OK,
      mensaje: 'Credenciales correctas',
      datos: mockUser
    }
    
    service.login$(mocklogin).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    })

    const req = httpMock.expectOne(urlLogin);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse); 
  });

  it('Prueba olvido de clave', () => {
    const mockIdentificacion = '12345678910';

    const mockResponse: IResponseApi = {
      estado: TypeResponse.OK,
      mensaje: 'Validación correcta y envio de correo electronico',
      datos: {}
    }
    
    service.forgotPassword$(mockIdentificacion).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    })

    const req = httpMock.expectOne(`${urlForgotPassword}/${mockIdentificacion}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); 
  });

  it('Prueba restaurar clave', () => {
    const mockRestorePassword: IRestoretPassword = {
      codigo: '123456',
      usuario: '123456789',
      clave: '*Clave123',
      clave_nueva: '*Clave123',
    }

    const mockResponse: IResponseApi = {
      estado: TypeResponse.OK,
      mensaje: 'Validación correcta y envio de correo electronico',
      datos: {}
    }
    
    service.restorePassword$(mockRestorePassword).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    })

    const req = httpMock.expectOne(urlRestorePassword);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse); 
  });

  it('Prueba cerrar sesión', () => {
    const mockLogout: ILogout = {
      id_usuario: 1,
      georreferencia: {
        x: 10.7637263,
        y: -75.72336763
      }
    };

    const mockResponse: IResponseApi = {
      estado: TypeResponse.OK,
      mensaje: 'Validación correcta y envio de correo electronico',
      datos: {}
    }
    
    service.logout$(mockLogout).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(storageMock.destroy).toHaveBeenCalled();
    })

    const req = httpMock.expectOne(urlLogout);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse); 
  });

  it('Prueba cambiar clave', () => {
    const mockChangePassword: IChangePassword = {
      clave_actual: 'Clave123*',
      clave_nueva: '*Clave123',
      confirmacion_clave_nueva: '*Clave123',
    }

    const mockResponse: IResponseApi = {
      estado: TypeResponse.OK,
      mensaje: 'Validación correcta y envio de correo electronico',
      datos: {}
    }
    
    service.changePassword$(mockChangePassword).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    })

    const req = httpMock.expectOne(urlChangePassword);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse); 
  });

  it('Retona currentUser', async () => {
    const mockUser: IUser = {
      id_usuario: 1,
      nombres: 'nombre',
      apellidos: 'apellidos',
      identificacion: '123456789',
      tipo_identificacion: '123456789',
      ind_cambio_clave: 'S',
      ind_cambio_placa: 'N',
      zonas: [],
      menu: [],
    }

    storageMock.get.mockReturnValue(mockUser);

    await service.getCurrentUser();

    expect(storageMock.get).toHaveBeenCalled();
  });
});
