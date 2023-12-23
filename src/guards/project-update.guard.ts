import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable
} from "@nestjs/common";
import { ProjectService } from "src/project/project.service";

@Injectable()
export class ProjectUpdateGuard implements CanActivate {
	constructor(@Inject(ProjectService) private projectService: ProjectService) {}
	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const project = await this.projectService.findOneById(
			request.params.projectId
		);
		return project && project.ownerId === request.user.id;
	}
}
