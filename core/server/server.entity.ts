import { HttpMethod } from "../http/http.enum";
import { NotFoundRouter } from "../router/defaults/not-found.router";
import { Router } from "../router/router.entity";
import { RouterHandler } from "../router/router.interface";

export class UnicornServer {
	private _routers: Router[] = [];

	private registerRouter(path: string, method: HttpMethod, handler: RouterHandler): void
	{
		this._routers.push(new Router(path, method, handler));
	}

	public get(path: string, handler: RouterHandler): void
	{
		this.registerRouter(path, HttpMethod.GET, handler);
	}

	public post(path: string, handler: RouterHandler): void
	{
		this.registerRouter(path, HttpMethod.POST, handler);
	}

	public patch(path: string, handler: RouterHandler): void
	{
		this.registerRouter(path, HttpMethod.PATCH, handler);
	}

	public put(path: string, handler: RouterHandler): void
	{
		this.registerRouter(path, HttpMethod.PUT, handler);
	}

	public delete(path: string, handler: RouterHandler): void
	{
		this.registerRouter(path, HttpMethod.DELETE, handler);
	}

	public serve(port: number): void
	{
		Bun.serve({
			port,
			fetch: (request: Request) => {
				for (const router of this._routers)
					if (router.match(request))
						return (router.handler());
				return NotFoundRouter.handler();
			}
		})
	}

}
