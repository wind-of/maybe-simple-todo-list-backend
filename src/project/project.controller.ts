import {
	Body,
	Controller,
	Delete,
	Param,
	Post,
	Request,
	UseGuards,
	Patch,
	Get
} from "@nestjs/common";
import { ProjectService } from "src/project/project.service";
import { CreateProjectDto } from "src/project/dto/create-project.dto";
import { AuthenticatedGuard } from "src/guards/authentication.guard";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectOwnerGuard } from "./guards/project-owner.guard";
import { RolesService } from "src/roles/roles.service";
import { ProjectRoles } from "src/enums/project.roles.enum";

@Controller("project")
export class ProjectController {
	constructor(
		private readonly projectService: ProjectService,
		private readonly rolesService: RolesService
	) {}

	@UseGuards(AuthenticatedGuard)
	@Get()
	async getAllProjects(@Request() req) {
		return this.projectService.findAllByOwnerId(req.user.id);
	}

	@UseGuards(AuthenticatedGuard, ProjectOwnerGuard)
	@Get(":projectId")
	async getProject(@Param("projectId") id: number) {
		return this.projectService.findOneById(id);
	}

	@UseGuards(AuthenticatedGuard)
	@Post()
	async createProject(
		@Request() req,
		@Body() createProjectDto: CreateProjectDto
	) {
		const project = await this.projectService.create({
			...createProjectDto,
			ownerId: req.user.id
		});
		await this.rolesService.create({
			projectId: project.id,
			userId: req.user.id,
			role: ProjectRoles.Owner
		});
		return project;
	}

	@UseGuards(AuthenticatedGuard, ProjectOwnerGuard)
	@Patch(":projectId")
	async updateProject(
		@Param("projectId") id: number,
		@Body() updateProjectDto: UpdateProjectDto
	) {
		return this.projectService.update(id, updateProjectDto);
	}

	@UseGuards(AuthenticatedGuard, ProjectOwnerGuard)
	@Delete(":projectId")
	async remove(@Param("projectId") id: number) {
		await this.projectService.remove(id);
	}
}
