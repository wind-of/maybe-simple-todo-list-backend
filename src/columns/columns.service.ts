import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Columns as ColumnEntity } from "src/entities/column.entity";
import { ColumnSearchCriteria } from "src/columns/types/column-criteria";
import { CreateColumnDto } from "./dto/create-column.dto";

@Injectable()
export class ColumnsService {
	constructor(
		@InjectRepository(ColumnEntity)
		private columnsRepository: Repository<ColumnEntity>
	) {}

	create(column: CreateColumnDto) {
		return this.columnsRepository.save(column);
	}

	async update(id: number, column: Partial<ColumnEntity>) {
		await this.columnsRepository.update({ id }, column);
	}

	async remove(id: number) {
		await this.columnsRepository.delete({ id });
	}

	findBy(criteria: ColumnSearchCriteria) {
		return this.columnsRepository.findOneBy(criteria);
	}

	findAllBy(criteria: ColumnSearchCriteria) {
		return this.columnsRepository.findBy(criteria);
	}
}
